package com.nexo.expensetracker.service;

import com.nexo.expensetracker.dto.ExpenseRequest;
import com.nexo.expensetracker.dto.ExpenseResponse;
import com.nexo.expensetracker.entity.Category;
import com.nexo.expensetracker.entity.Expense;
import com.nexo.expensetracker.entity.User;
import com.nexo.expensetracker.repository.CategoryRepository;
import com.nexo.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.nexo.expensetracker.specification.ExpenseSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private ExpenseResponse toResponse(Expense e) {
        return new ExpenseResponse(
                e.getId(),
                e.getDescription(),
                e.getAmount(),
                e.getDate(),
                e.getCategory().getId(),
                e.getCategory().getName(),
                e.getCategory().getIcon());
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpenses(Long categoryId, LocalDate startDate, LocalDate endDate) {
        User user = getCurrentUser();

        Specification<Expense> spec = Specification
                .where(ExpenseSpecification.hasUser(user))
                .and(ExpenseSpecification.hasCategoryId(categoryId))
                .and(ExpenseSpecification.hasDateAfterOrEqual(startDate))
                .and(ExpenseSpecification.hasDateBeforeOrEqual(endDate));

        return expenseRepository
                .findAll(spec, Sort.by(Sort.Direction.DESC, "date").and(Sort.by(Sort.Direction.DESC, "id")))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        User user = getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Expense expense = Expense.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .date(request.getDate())
                .category(category)
                .user(user)
                .build();

        expenseRepository.save(expense);
        return toResponse(expense);
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        User user = getCurrentUser();
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        expense.setCategory(category);

        expenseRepository.save(expense);
        return toResponse(expense);
    }

    public void deleteExpense(Long id) {
        User user = getCurrentUser();
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        expenseRepository.delete(expense);
    }
}