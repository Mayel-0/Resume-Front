function Footer() {
  const year = new Date().getFullYear();

  const handleDownload = async () => {
    const url = `${import.meta.env.VITE_API_URL}/documents/Cv_Mael_llado.pdf`;
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "CV_Mael_Llado.pdf";
    a.click();

    URL.revokeObjectURL(blobUrl);
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>© {year} Maël LLADO — Bordeaux, France</p>
        <div className="footer__links">
          <a href="https://www.linkedin.com/in/llado-mael-54008a384/" target="_blank" rel="noopener noreferrer">Linkedin</a>
          <a href="https://github.com/Mayel-0" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="mailto:llado.mael33@gmail.com" target="_blank" rel="noopener noreferrer">Gmail</a>
          <a onClick={handleDownload} aria-label="...">
          CV
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
