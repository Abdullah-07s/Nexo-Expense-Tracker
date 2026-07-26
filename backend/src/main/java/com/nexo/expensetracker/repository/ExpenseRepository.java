package com.nexo.expensetracker.repository;

import com.nexo.expensetracker.entity.Expense;
import com.nexo.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {
        Optional<Expense> findByIdAndUser(Long id, User user);
}