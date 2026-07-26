package com.nexo.expensetracker.service;

import com.nexo.expensetracker.dto.BudgetRequest;
import com.nexo.expensetracker.dto.BudgetResponse;
import com.nexo.expensetracker.entity.Budget;
import com.nexo.expensetracker.entity.Category;
import com.nexo.expensetracker.entity.Expense;
import com.nexo.expensetracker.entity.User;
import com.nexo.expensetracker.repository.BudgetRepository;
import com.nexo.expensetracker.repository.CategoryRepository;
import com.nexo.expensetracker.repository.ExpenseRepository;
import com.nexo.expensetracker.specification.ExpenseSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private BigDecimal calculateSpent(User user, Long categoryId, YearMonth month) {
        Specification<Expense> spec = Specification
                .where(ExpenseSpecification.hasUser(user))
                .and(ExpenseSpecification.hasCategoryId(categoryId))
                .and(ExpenseSpecification.hasDateAfterOrEqual(month.atDay(1)))
                .and(ExpenseSpecification.hasDateBeforeOrEqual(month.atEndOfMonth()));

        return expenseRepository.findAll(spec).stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BudgetResponse toResponse(Budget budget) {
        BigDecimal spent = calculateSpent(budget.getUser(), budget.getCategory().getId(), budget.getMonth());
        BigDecimal remaining = budget.getLimitAmount().subtract(spent);
        double percentUsed = budget.getLimitAmount().compareTo(BigDecimal.ZERO) > 0
                ? spent.divide(budget.getLimitAmount(), 4, java.math.RoundingMode.HALF_UP).doubleValue() * 100
                : 0.0;
        boolean exceeded = spent.compareTo(budget.getLimitAmount()) > 0;

        return new BudgetResponse(
                budget.getId(),
                budget.getCategory().getId(),
                budget.getCategory().getName(),
                budget.getCategory().getIcon(),
                budget.getLimitAmount(),
                spent,
                remaining,
                Math.round(percentUsed * 10) / 10.0,
                exceeded,
                budget.getMonth());
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets(YearMonth month) {
        User user = getCurrentUser();
        return budgetRepository.findByUserAndMonth(user, month)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BudgetResponse createBudget(BudgetRequest request) {
        User user = getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        if (budgetRepository.findByUserAndCategoryIdAndMonth(user, request.getCategoryId(), request.getMonth())
                .isPresent()) {
            throw new IllegalArgumentException("Budget already exists for this category and month");
        }

        Budget budget = Budget.builder()
                .category(category)
                .user(user)
                .limitAmount(request.getLimitAmount())
                .month(request.getMonth())
                .build();

        budgetRepository.save(budget);
        return toResponse(budget);
    }

    public BudgetResponse updateBudget(Long id, BudgetRequest request) {
        User user = getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        budget.setLimitAmount(request.getLimitAmount());
        budgetRepository.save(budget);

        return toResponse(budget);
    }

    public void deleteBudget(Long id) {
        User user = getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        budgetRepository.delete(budget);
    }
}