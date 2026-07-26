package com.nexo.expensetracker.repository;

import com.nexo.expensetracker.entity.Budget;
import com.nexo.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserAndMonth(User user, YearMonth month);

    Optional<Budget> findByIdAndUser(Long id, User user);

    Optional<Budget> findByUserAndCategoryIdAndMonth(User user, Long categoryId, YearMonth month);
}