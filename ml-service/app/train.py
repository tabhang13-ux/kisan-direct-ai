import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

def generate_synthetic_data(num_samples=1200):
    np.random.seed(42)
    crops = ['Tomato', 'Onion', 'Potato', 'Wheat', 'Rice (Basmati)', 'Grapes', 'Pomegranate', 'Soybean']
    locations = ['Pune', 'Narayangaon', 'Chakan', 'Baramati', 'Hadapsar', 'Manchar', 'Junnar']
    seasons = ['Kharif', 'Rabi', 'Zaid', 'Monsoon']
    
    data = []
    for _ in range(num_samples):
        crop = np.random.choice(crops)
        location = np.random.choice(locations)
        month = np.random.randint(1, 13)
        season = np.random.choice(seasons)
        festival = np.random.choice([0, 1], p=[0.75, 0.25])
        
        # Base demand logic
        base_demand = 15000 if crop in ['Tomato', 'Onion', 'Potato'] else 8000
        prev_demand = base_demand + np.random.normal(0, 2000)
        supply = base_demand + np.random.normal(-1500, 2500)
        temperature = 22 + 10 * np.sin(month * np.pi / 6) + np.random.normal(0, 2)
        
        # Demand calculation
        demand = prev_demand * 0.4 + (20000 - supply) * 0.3 + festival * 3000 + np.random.normal(0, 1000)
        demand = max(2000, round(demand))
        
        # Price calculation based on demand-supply gap
        gap = demand - supply
        base_price = 25.0 if crop == 'Tomato' else (30.0 if crop == 'Onion' else 20.0)
        recommended_price = base_price + (gap / 1000.0) * 1.5 + (festival * 2.0)
        recommended_price = max(10.0, round(recommended_price, 2))
        
        data.append({
            'crop': crop,
            'location': location,
            'month': month,
            'season': season,
            'festival': festival,
            'previous_demand': round(prev_demand),
            'supply': round(supply),
            'temperature': round(temperature, 1),
            'quantity_demanded': demand,
            'recommended_price': recommended_price
        })
    
    df = pd.DataFrame(data)
    os.makedirs(os.path.dirname(__file__) + '/data', exist_ok=True)
    df.to_csv(os.path.join(os.path.dirname(__file__), 'data/sample_crop_data.csv'), index=False)
    return df

def train_models():
    df = generate_synthetic_data()
    print("Dataset generated successfully. Shape:", df.shape)
    
    # Feature encoding
    df_encoded = pd.get_dummies(df, columns=['crop', 'location', 'season'], drop_first=False)
    
    X_demand = df_encoded.drop(columns=['quantity_demanded', 'recommended_price'])
    y_demand = df_encoded['quantity_demanded']
    
    X_price = df_encoded.drop(columns=['quantity_demanded', 'recommended_price'])
    y_price = df_encoded['recommended_price']
    
    demand_model = RandomForestRegressor(n_estimators=100, random_state=42)
    demand_model.fit(X_demand, y_demand)
    
    price_model = RandomForestRegressor(n_estimators=100, random_state=42)
    price_model.fit(X_price, y_price)
    
    feature_columns = list(X_demand.columns)
    
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(demand_model, os.path.join(models_dir, 'demand_model.pkl'))
    joblib.dump(price_model, os.path.join(models_dir, 'price_model.pkl'))
    joblib.dump(feature_columns, os.path.join(models_dir, 'feature_columns.pkl'))
    
    print("[OK] Models trained and saved to ml-service/app/models/")

if __name__ == '__main__':
    train_models()
