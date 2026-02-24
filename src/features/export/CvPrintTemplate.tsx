import type { MasterCV } from "../../types";

export function CvPrintTemplate({ cv }: { cv: MasterCV }) {
    if (!cv) return null;

    return (
        <div className="font-sans text-black leading-relaxed max-w-3xl mx-auto p-8 print:p-0 print:max-w-none">

            {/* HEADER */}
            <header className="mb-8 border-b-2 border-black pb-4">
                <h1 className="text-4xl font-bold mb-2 break-words">CV</h1>
                <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                    {cv.links && cv.links.map((link, i) => (
                        <span key={i}>{link}</span>
                    ))}
                </div>
            </header>

            {/* PROFILE SUMMARY */}
            {cv.profile && (
                <section className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-800">Profil</h2>
                    <p className="whitespace-pre-line text-sm">{cv.profile}</p>
                </section>
            )}

            {/* EXPERIENCE */}
            {cv.experiences && cv.experiences.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-4 text-gray-800">Arbetslivserfarenhet</h2>
                    <div className="space-y-6">
                        {cv.experiences.map((exp, i) => (
                            <div key={i} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-md font-bold text-gray-900">{exp.role}</h3>
                                    <span className="text-sm text-gray-600 font-medium">{exp.period}</span>
                                </div>
                                <div className="text-sm text-gray-700 font-medium mb-2">{exp.company}</div>
                                {exp.description && <p className="text-sm mb-2">{exp.description}</p>}
                                {exp.bullets && exp.bullets.length > 0 && (
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* EDUCATION */}
            {cv.education && cv.education.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-4 text-gray-800">Utbildning</h2>
                    <div className="space-y-4">
                        {cv.education.map((edu, i) => (
                            <div key={i} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-md font-bold text-gray-900">{edu.degree}</h3>
                                    <span className="text-sm text-gray-600 font-medium">{edu.period}</span>
                                </div>
                                <div className="text-sm text-gray-700 font-medium mb-1">{edu.school}</div>
                                {edu.description && <p className="text-sm">{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* SKILLS */}
            {cv.skills && cv.skills.length > 0 && (
                <section className="mb-8 break-inside-avoid">
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-800">Kompetenser</h2>
                    <p className="text-sm leading-relaxed">
                        {cv.skills.join(" • ")}
                    </p>
                </section>
            )}

            {/* CERTIFICATIONS & LANGUAGES */}
            <div className="grid grid-cols-2 gap-8 break-inside-avoid">
                {cv.certifications && cv.certifications.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-800">Certifikat</h2>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            {cv.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
                        </ul>
                    </section>
                )}

                {cv.languages && cv.languages.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-800">Språk</h2>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            {cv.languages.map((lang, i) => <li key={i}>{lang}</li>)}
                        </ul>
                    </section>
                )}
            </div>

        </div>
    );
}
