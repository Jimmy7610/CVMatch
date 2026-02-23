export default function ExportPdfPage() {
    return (
        <div className="space-y-6 p-8 bg-white text-black min-h-screen">
            <h1 className="text-3xl font-bold">Utskrift (ATS Vänligt)</h1>
            <button onClick={() => window.print()} className="print:hidden mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Skriv ut PDF
            </button>
        </div>
    );
}
