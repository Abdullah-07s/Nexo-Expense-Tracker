package com.nexo.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

@Data
@AllArgsConstructor
public class MonthlySummaryResponse {
    private YearMonth month;
    private BigDecimal totalSpent;
    private BigDecimal totalBudget;
    private BigDecimal remaining;
    private int totalTransactions;
    private List<CategoryBreakdownItem> categoryBreakdown;
}