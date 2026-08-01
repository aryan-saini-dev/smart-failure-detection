# Startup Success/Failure Prediction Dataset

**Source**: [Crunchbase Dataset](file:///c:/Users/Aryan%20Saini/Documents/Git%20Projects/smart-failure-detection/Dataset/big_startup_secsees_dataset.csv)

## Main Characteristics
- **Size**: 66,368 total records. We filtered this to ~13,334 records that have reached a definitive outcome (either 'closed', 'acquired', or 'ipo').
- **Target Variable**: `is_success` (Derived from the `status` column. 1 if 'acquired' or 'ipo', 0 if 'closed').
- **Key Features**:
  - **Categorical**: `country_code`, `main_category` (extracted from `category_list`)
  - **Numerical**: `funding_total_usd`, `funding_rounds`, `funding_duration`, `time_to_first_funding`, `category_count`

## Data Cleaning & Preprocessing (Advanced)
- **Handling Missing Values**: Used `SimpleImputer` (median for numerical, constant placeholder for categorical).
- **Target Encoding**: Due to the extremely high cardinality of the `main_category` (500+ unique values) and `country_code` (84 values), we applied a `TargetEncoder` rather than One-Hot Encoding. This prevents matrix sparsity and boosts performance.
- **Scaling**: Standardized numerical features (`StandardScaler`).
- **Data Splitting**: Used `train_test_split` with `stratify=y` to ensure the 80/20 train/test split maintains the 53/47 success-to-failure ratio.

## Model Performance (Optimized XGBoost)
- **Algorithm**: Extreme Gradient Boosting (`XGBClassifier`)
- **Tuning**: Grid Search found the optimal parameters: `learning_rate: 0.05`, `max_depth: 5`, `n_estimators: 200`.
- **Accuracy**: ~75.3% (Up from the 72.6% Random Forest baseline)
- **F1-Scores**:
  - Failure (0): 0.72
  - Success (1): 0.78

> [!TIP]
> This optimized model presents a highly realistic, production-ready approach to predicting startup failure, properly utilizing historical outcomes, avoiding data leakage, and implementing safeguards against overfitting.
