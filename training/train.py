from pathlib import Path
import joblib
from datasets import load_from_disk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import Pipeline

root = Path(__file__).resolve().parents[1]
data_dir = root / "data" / "ro_offense"
model_dir = root / "models"
model_path = model_dir / "message_classifier.joblib"