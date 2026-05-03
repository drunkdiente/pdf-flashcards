import sys

def read_pdf(file_path):
    try:
        import fitz
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except ImportError:
        pass
    
    try:
        import PyPDF2
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text
    except ImportError:
        return "Failed to import PyMuPDF or PyPDF2"

if __name__ == "__main__":
    text = read_pdf(r"c:\Users\User\Documents\GitHub\pdf-flashcards\Fullstack Labs.pdf")
    with open(r"c:\Users\User\Documents\GitHub\pdf-flashcards\backend\lab_content.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Text extracted to lab_content.txt")
