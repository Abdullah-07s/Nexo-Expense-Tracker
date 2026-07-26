package com.nexo.expensetracker.service;

import com.nexo.expensetracker.dto.CategoryRequest;
import com.nexo.expensetracker.dto.CategoryResponse;
import com.nexo.expensetracker.entity.Category;
import com.nexo.expensetracker.entity.User;
import com.nexo.expensetracker.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        User user = getCurrentUser();
        return categoryRepository.findByUserOrderByNameAsc(user)
                .stream()
                .map(c -> new CategoryResponse(c.getId(), c.getName(), c.getIcon(), c.isPreset()))
                .toList();
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        User user = getCurrentUser();

        if (categoryRepository.existsByNameAndUser(request.getName(), user)) {
            throw new IllegalArgumentException("Category with this name already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .icon(request.getIcon())
                .preset(false)
                .user(user)
                .build();

        categoryRepository.save(category);
        return new CategoryResponse(category.getId(), category.getName(), category.getIcon(), category.isPreset());
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        User user = getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        category.setName(request.getName());
        category.setIcon(request.getIcon());
        categoryRepository.save(category);

        return new CategoryResponse(category.getId(), category.getName(), category.getIcon(), category.isPreset());
    }

    public void deleteCategory(Long id) {
        User user = getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        if (category.isPreset()) {
            throw new IllegalArgumentException("Preset categories cannot be deleted");
        }

        categoryRepository.delete(category);
    }

    public void seedPresetCategories(User user) {
        String[][] presets = {
                { "Food", "🍔" },
                { "Transport", "🚗" },
                { "Bills", "💡" },
                { "Entertainment", "🎬" },
                { "Shopping", "🛍️" },
                { "Others", "📦" }
        };

        for (String[] preset : presets) {
            Category category = Category.builder()
                    .name(preset[0])
                    .icon(preset[1])
                    .preset(true)
                    .user(user)
                    .build();
            categoryRepository.save(category);
        }
    }
}