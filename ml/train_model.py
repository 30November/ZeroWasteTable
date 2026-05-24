
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# Define file paths
DATA_FILE = os.path.join(os.path.dirname(__file__), 'ngo_food_data.csv')
MODEL_FILE = os.path.join(os.path.dirname(__file__), 'model.pkl')
ENCODERS_FILE = os.path.join(os.path.dirname(__file__), 'encoders.pkl')

def train_model():
    """
    Loads data, preprocesses it, trains a RandomForestClassifier,
    and saves the model and encoders.
    """
    print("Loading data...")
    df = pd.read_csv(DATA_FILE)

    # --- Feature Engineering & Preprocessing ---
    print("Preprocessing data...")

    # 1. Select features and target
    features = [
        'food_category', 'quantity', 'ngo_capacity', 'distance_km',
        'expiry_hours', 'pickup_deadline_hours'
    ]
    target = 'accepted'

    X = df[features]
    y = df[target]

    # 2. Encode Categorical Features
    # We use LabelEncoder for simplicity here. For production, OneHotEncoder is often better.
    categorical_cols = ['food_category', 'ngo_capacity']
    encoders = {}
    
    for col in categorical_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        encoders[col] = le
        print(f"Encoded '{col}' with classes: {le.classes_}")

    # --- Model Training ---
    print("Training RandomForestClassifier...")

    # 1. Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 2. Initialize and train the model
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)

    # --- Evaluation ---
    print("Evaluating model...")
    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)

    print(f"\nModel Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(report)

    # --- Save Artifacts ---
    print("Saving model and encoders...")

    # 1. Save the trained model
    joblib.dump(model, MODEL_FILE)
    print(f"Model saved to {MODEL_FILE}")

    # 2. Save the encoders
    joblib.dump(encoders, ENCODERS_FILE)
    print(f"Encoders saved to {ENCODERS_FILE}")

if __name__ == "__main__":
    train_model()
