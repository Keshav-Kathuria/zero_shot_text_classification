from transformers import pipeline

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def classify(text, labels):
    """
    Classifies given text into the most likely label(s) without training.
    text: string
    labels: list of strings
    """
    return classifier(text, labels)
