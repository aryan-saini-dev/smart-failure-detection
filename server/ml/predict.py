import sys
import json
import os
import joblib
import pandas as pd

def main():
    try:
        # Read JSON string from the first command line argument
        if len(sys.argv) < 2:
            raise ValueError("No input data provided. Please pass JSON data as an argument.")
            
        input_data = json.loads(sys.argv[1])
        
        # Convert dictionary to single-row DataFrame
        # Features expected by pipeline: 
        # ['funding_total_usd', 'funding_rounds', 'funding_duration', 'time_to_first_funding', 'category_count', 'country_code', 'main_category']
        df = pd.DataFrame([input_data])
        
        # Determine the absolute path to the model file to avoid relative path issues
        model_path = os.path.join(os.path.dirname(__file__), 'startup_model_optimized.joblib')
        
        # Load the pipeline
        pipeline = joblib.load(model_path)
        
        # Predict
        prediction = pipeline.predict(df)[0] # 1 for success, 0 for failure
        probabilities = pipeline.predict_proba(df)[0]
        
        # Calculate risk based on failure probability (index 0)
        failure_prob = probabilities[0] * 100
        success_prob = probabilities[1] * 100
        
        result = {
            "prediction": "Success" if prediction == 1 else "Failure",
            "failureProbability": float(failure_prob),
            "successProbability": float(success_prob)
        }
        
        # Output strictly JSON
        print(json.dumps(result))
        
    except Exception as e:
        # Return an error JSON if something fails
        error_result = {
            "error": str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
