package com.nexo.expensetracker.service;

import com.nexo.expensetracker.dto.CategoryBreakdownItem;
import com.nexo.expensetracker.dto.MonthlySummaryResponse;
import com.nexo.expensetracker.entity.Budget;
import com.nexo.expensetracker.entity.Expense;
import com.nexo.expensetracker.entity.User;
import com.nexo.expensetracker.repository.BudgetRepository;
import com.nexo.expensetracker.repository.ExpenseRepository;
import com.nexo.expensetracker.specification.ExpenseSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SummaryService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Transactional(readOnly = true)
    public MonthlySummaryResponse getMonthlySummary(YearMonth month) {
        User user = getCurrentUser();

        Specification<Expense> spec = Specification
                .where(ExpenseSpecification.hasUser(user))
                .and(ExpenseSpecification.hasDateAfterOrEqual(month.atDay(1)))
                .and(ExpenseSpecification.hasDateBeforeOrEqual(month.atEndOfMonth()));

        List<Expense> expenses = expenseRepository.findAll(spec);

        BigDecimal totalSpent = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Budget> budgets = budgetRepository.findByUserAndMonth(user, month);
        BigDecimal totalBudget = budgets.stream()
                .map(Budget::getLimitAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining = totalBudget.subtract(totalSpent);

        Map<Long, List<Expense>> grouped = expenses.stream()
                .collect(Collectors.groupingBy(e -> e.getCategory().getId()));

        List<CategoryBreakdownItem> breakdown = grouped.entrySet().stream()
                .map(entry -> {
                    List<Expense> categoryExpenses = entry.getValue();
                    Expense sample = categoryExpenses.get(0);
                    BigDecimal categoryTotal = categoryExpenses.stream()
                            .map(Expense::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    double percent = totalSpent.compareTo(BigDecimal.ZERO) > 0
                            ? categoryTotal.divide(totalSpent, 4, RoundingMode.HALF_UP).doubleValue() * 100
                            : 0.0;

                    return new CategoryBreakdownItem(
                            sample.getCategory().getId(),
                            sample.getCategory().getName(),
                            sample.getCategory().getIcon(),
                            categoryTotal,
                            Math.round(percent * 10) / 10.0);
                })
                .sorted(Comparator.comparing(CategoryBreakdownItem::getAmount).reversed())
                .toList();

        return new MonthlySummaryResponse(
                month,
                totalSpent,
                totalBudget,
                remaining,
                expenses.size(),
                breakdown);
    }
}