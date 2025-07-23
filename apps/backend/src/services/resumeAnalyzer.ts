// src/services/resumeAnalyzer.ts
import OpenAI from "openai";
import type {
  ResumeAnalysisResult,
  JobCategory,
  HighlightedText,
} from "../db/index.js";
import pdfParse from "pdf-parse";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);

    return data.text ?? "";
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(
      "Failed to extract text from PDF: " + (error as Error).message
    );
  }
}

async function generateHighlightedText(
  resumeText: string,
  jobCategory: JobCategory
): Promise<HighlightedText[]> {
  try {
    const prompt = `
You are an expert resume reviewer. Analyze the resume text and identify specific sentences or phrases that are either strengths or weaknesses for a ${jobCategory.replace(
      "-",
      " "
    )} role.

Resume Text:
${resumeText}

Identify key phrases and sentences that are:
1. STRENGTHS - Strong points that contribute positively to the resume
2. WEAKNESSES - Areas that need improvement or detract from the resume
3. NEUTRAL - Important but neutral content

For each identified text segment, provide:
- The exact text from the resume
- Whether it's a strength, weakness, or neutral
- The section it belongs to (education, experience, skills, projects, etc.)
- A brief reason why it's classified as such

Respond with JSON in this format:
{
  "highlights": [
    {
      "text": "exact text from resume",
      "type": "strength|weakness|neutral",
      "section": "education|experience|skills|projects|other",
      "reason": "brief explanation"
    }
  ]
}

Focus on identifying 10-15 key text segments that best represent the resume's strengths and weaknesses.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume reviewer. Identify specific text segments that represent strengths and weaknesses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return result.highlights || [];
  } catch (error) {
    console.error("Error generating highlighted text:", error);
    return [];
  }
}

async function generateMainAnalysis(
  resumeText: string,
  jobCategory: JobCategory
): Promise<Omit<ResumeAnalysisResult, "originalText" | "highlightedText">> {
  try {
    const prompt = `
You are an expert resume reviewer and career coach. Analyze the following resume for a ${jobCategory.replace(
      "-",
      " "
    )} role and provide detailed feedback.

Resume Text:
${resumeText}

Analyze the resume and respond with JSON in exactly this format:
{
  "fullName": "extracted full name from resume",
  "jobCategory": "${jobCategory}",
  "overallScore": <number 0-100>,
  "sections": {
    "education": {
      "score": <number 0-100>,
      "feedback": "detailed feedback about education section"
    },
    "experience": {
      "score": <number 0-100>, 
      "feedback": "detailed feedback about work experience"
    },
    "skills": {
      "score": <number 0-100>,
      "feedback": "detailed feedback about skills section"
    },
    "projects": {
      "score": <number 0-100>,
      "feedback": "detailed feedback about projects section if present"
    }
  },
  "summary": "overall resume assessment and key recommendations",
  "suggestedFixes": {
    "fix1": "specific improvement suggestion with before/after example",
    "fix2": "another specific improvement suggestion",
    "fix3": "additional improvement suggestion"
  },
  "atsScore": {
    "format": <number 0-100>,
    "keywords": <number 0-100>, 
    "readability": <number 0-100>
  }
}

Provide constructive, actionable feedback. Focus on:
1. Quantifiable achievements and impact
2. Relevant keywords for the target role
3. ATS optimization
4. Professional presentation
5. Specific improvements with examples
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume reviewer. Analyze resumes and provide detailed, constructive feedback in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0]?.message.content || "{}");

    // Validate and ensure all required fields are present
    return {
      fullName: result.fullName || "Unknown",
      jobCategory,
      overallScore: Math.max(0, Math.min(100, result.overallScore || 0)),
      sections: {
        education: {
          score: Math.max(
            0,
            Math.min(100, result.sections?.education?.score || 0)
          ),
          feedback:
            result.sections?.education?.feedback ||
            "No education feedback available",
        },
        experience: {
          score: Math.max(
            0,
            Math.min(100, result.sections?.experience?.score || 0)
          ),
          feedback:
            result.sections?.experience?.feedback ||
            "No experience feedback available",
        },
        skills: {
          score: Math.max(
            0,
            Math.min(100, result.sections?.skills?.score || 0)
          ),
          feedback:
            result.sections?.skills?.feedback || "No skills feedback available",
        },
        ...(result.sections?.projects && {
          projects: {
            score: Math.max(
              0,
              Math.min(100, result.sections.projects.score || 0)
            ),
            feedback:
              result.sections.projects.feedback ||
              "No projects feedback available",
          },
        }),
      },
      summary: result.summary || "Resume analysis completed",
      suggestedFixes: result.suggestedFixes || {},
      atsScore: {
        format: Math.max(0, Math.min(100, result.atsScore?.format || 0)),
        keywords: Math.max(0, Math.min(100, result.atsScore?.keywords || 0)),
        readability: Math.max(
          0,
          Math.min(100, result.atsScore?.readability || 0)
        ),
      },
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(
      "Failed to analyze resume with AI: " + (error as Error).message
    );
  }
}

export async function analyzeResumeWithAI(
  resumeText: string,
  jobCategory: JobCategory
): Promise<ResumeAnalysisResult> {
  try {
    const [
      analysisResult,
      //  highlightedText
    ] = await Promise.all([
      generateMainAnalysis(resumeText, jobCategory),
      // generateHighlightedText(resumeText, jobCategory),
    ]);

    return {
      ...analysisResult,
      originalText: resumeText,
      // highlightedText,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(
      "Failed to analyze resume with AI: " + (error as Error).message
    );
  }
}

export async function analyzeResume(
  pdfBuffer: Buffer,
  jobCategory: JobCategory
): Promise<ResumeAnalysisResult> {
  try {
    const resumeText = await extractTextFromPDF(pdfBuffer);

    if (!resumeText.trim()) {
      throw new Error("No readable text found in the PDF file");
    }

    const analysis = await analyzeResumeWithAI(resumeText, jobCategory);

    return analysis;
  } catch (error) {
    console.error("Resume analysis error:", error);
    throw new Error("Failed to analyze resume: " + (error as Error).message);
  }
}
