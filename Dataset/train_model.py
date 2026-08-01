import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from category_encoders import TargetEncoder
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report

def main():
    # Load dataset
    df = pd.read_csv('big_startup_secsees_dataset.csv')
    
    # 1. Filter dataset to completed outcomes
    valid_statuses = ['closed', 'acquired', 'ipo']
    df = df[df['status'].isin(valid_statuses)].copy()
    
    # Target: 1 for success (acquired/ipo), 0 for failure (closed)
    df['is_success'] = df['status'].apply(lambda x: 1 if x in ['acquired', 'ipo'] else 0)
    
    # 2. Clean 'funding_total_usd'
    df['funding_total_usd'] = pd.to_numeric(df['funding_total_usd'].replace('-', np.nan), errors='coerce')
    
    # 3. Advanced Date Features
    date_cols = ['founded_at', 'first_funding_at', 'last_funding_at']
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors='coerce')
    
    # Duration between first and last funding
    df['funding_duration'] = (df['last_funding_at'] - df['first_funding_at']).dt.days
    df['funding_duration'] = df['funding_duration'].clip(lower=0)
    
    # Time to first funding (from founding date)
    df['time_to_first_funding'] = (df['first_funding_at'] - df['founded_at']).dt.days
    df['time_to_first_funding'] = df['time_to_first_funding'].clip(lower=0)
    
    # 4. Advanced Category Features
    df['main_category'] = df['category_list'].str.split('|').str[0]
    
    # Count of categories a startup operates in (proxy for complexity/focus)
    df['category_count'] = df['category_list'].str.count('\|') + 1
    df['category_count'] = df['category_count'].fillna(1)
    
    # Select features
    numeric_features = ['funding_total_usd', 'funding_rounds', 'funding_duration', 'time_to_first_funding', 'category_count']
    categorical_features = ['country_code', 'main_category']
    
    X = df[numeric_features + categorical_features]
    y = df['is_success']
    
    # Preprocessing pipelines
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        # Target Encoding is much better for high cardinality features like category and country
        ('target_encoder', TargetEncoder(handle_unknown='value'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    # Advanced Model Definition
    xgb_model = XGBClassifier(random_state=42, use_label_encoder=False, eval_metric='logloss')
    
    # Full Pipeline
    clf = Pipeline(steps=[('preprocessor', preprocessor),
                          ('classifier', xgb_model)])
    
    # Splitting the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Hyperparameter Grid Search
    param_grid = {
        'classifier__n_estimators': [100, 200],
        'classifier__max_depth': [3, 5, 7],
        'classifier__learning_rate': [0.05, 0.1]
    }
    
    print("Running GridSearchCV for XGBoost Pipeline...")
    grid_search = GridSearchCV(clf, param_grid, cv=3, scoring='f1', n_jobs=-1, verbose=1)
    grid_search.fit(X_train, y_train)
    
    print(f"Best parameters found: {grid_search.best_params_}")
    
    # Evaluate the best model
    best_model = grid_search.best_estimator_
    print("Evaluating optimal model...")
    y_pred = best_model.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the optimized model
    model_filename = 'startup_model_optimized.joblib'
    joblib.dump(best_model, model_filename)
    print(f"Optimized model saved to {model_filename}")

if __name__ == '__main__':
    main()
