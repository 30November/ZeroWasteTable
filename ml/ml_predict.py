
import joblib
import pandas as pd
import os

# --- Load Model and Encoders ---
# These are loaded once when the module is imported.
MODEL_FILE = os.path.join(os.path.dirname(__file__), 'model.pkl')
ENCODERS_FILE = os.path.join(os.path.dirname(__file__), 'encoders.pkl')

try:
    model = joblib.load(MODEL_FILE)
    encoders = joblib.load(ENCODERS_FILE)
    print("ML model and encoders loaded successfully.")
except FileNotFoundError:
    print("Error: model.pkl or encoders.pkl not found.")
    print("Please run 'python ml/train_model.py' first to generate these files.")
    model = None
    encoders = None

# --- Prediction Function ---

def predict_ngo_acceptance(food_category, quantity, ngo_capacity, distance_km, expiry_hours, pickup_deadline_hours):
    """
    Predicts the probability of an NGO accepting a food donation.

    Args:
        food_category (str): Category of the food (e.g., 'fastfood_snacks').
        quantity (int): Amount of food.
        ngo_capacity (str): Capacity of the NGO ('low', 'medium', 'high').
        distance_km (float): Distance between restaurant and NGO in kilometers.
        expiry_hours (int): Hours until the food expires.
        pickup_deadline_hours (int): Hours available for pickup.

    Returns:
        float: The probability of acceptance (0.0 to 100.0), or None if model is not loaded.
    """
    if not model or not encoders:
        print("Cannot predict because the model or encoders are not loaded.")
        return None

    # --- 1. Create a DataFrame from the input ---
    # The structure must match the training data.
    input_data = pd.DataFrame([{
        'food_category': food_category,
        'quantity': quantity,
        'ngo_capacity': ngo_capacity,
        'distance_km': distance_km,
        'expiry_hours': expiry_hours,
        'pickup_deadline_hours': pickup_deadline_hours
    }])

    # --- 2. Preprocess the input data using saved encoders ---
    # This step is crucial to ensure the model receives data in the same
    # numerical format it was trained on.
    for col, encoder in encoders.items():
        try:
            # Use the encoder to transform the categorical string to a number.
            # The input is a 1D array-like, so we take the first element.
            input_data[col] = encoder.transform(input_data[col])
        except ValueError as e:
            print(f"Error encoding '{col}': {e}. Make sure the input value is one of {encoder.classes_}")
            return None

    # --- 3. Ensure correct feature order ---
    # The model expects features in the exact order they were seen during training.
    feature_order = [
        'food_category', 'quantity', 'ngo_capacity', 'distance_km',
        'expiry_hours', 'pickup_deadline_hours'
    ]
    processed_input = input_data[feature_order]

    # --- 4. Make the prediction ---
    # Use `predict_proba` to get the probability for each class (0 and 1).
    # The result is a 2D array like [[prob_class_0, prob_class_1]].
    prediction_proba = model.predict_proba(processed_input)

    # We are interested in the probability of the "accepted" class, which is class 1.
    acceptance_probability = prediction_proba[0, 1]

    # Return as a percentage
    return acceptance_probability * 100

# --- Manual Test Example ---
if __name__ == "__main__":
    print("\n--- Running a manual prediction test ---")
    
    # Example 1: A likely acceptance
    test_case_1 = {
        "food_category": "fastfood_snacks",
        "quantity": 50,
        "ngo_capacity": "high",
        "distance_km": 5.0,
        "expiry_hours": 6,
        "pickup_deadline_hours": 3
    }
    
    probability = predict_ngo_acceptance(**test_case_1)
    if probability is not None:
        print(f"\nPrediction for test case 1:")
        print(f"Input: {test_case_1}")
        print(f"Predicted Acceptance Probability: {probability:.2f}%")

    # Example 2: An unlikely acceptance (low expiry, far distance)
    test_case_2 = {
        "food_category": "pure_vegetarian_meal",
        "quantity": 10,
        "ngo_capacity": "low",
        "distance_km": 25.0,
        "expiry_hours": 2,
        "pickup_deadline_hours": 1
    }

    probability_2 = predict_ngo_acceptance(**test_case_2)
    if probability_2 is not None:
        print(f"\nPrediction for test case 2:")
        print(f"Input: {test_case_2}")
        print(f"Predicted Acceptance Probability: {probability_2:.2f}%")
