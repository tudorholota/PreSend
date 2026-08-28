from datasets import load_dataset  
from pathlib import Path

root = Path(__file__).resolve().parents[1]
data_dir = root / "data" / "ro_offense"

def main():

    # For this instance, I will use the Romanian Offensive Language Dataset from Hugging Face.
    # This dataset contains tweets in Romanian that are labeled as offensive or not offensive.
    dataset = load_dataset("upb-nlp/ro-offense")
    data_dir.parent.mkdir(parents = True, exist_ok = True)
    dataset.save_to_disk(str(data_dir))

    #print(data_dir)

if __name__ == "__main__":
    main()

