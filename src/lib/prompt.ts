import type { VideoProject } from "@/data/schema";
import { fal } from "./fal";

type EnhancePromptOptions = {
  type: "image" | "video" | "music" | "voiceover";
  project?: VideoProject;
};

const SYSTEM_PROMPT = `
You're a video editor assistant. You will receive instruction to enhance the description of
images, audio-clips and video-clips in a video project. You will be given the name of project
and a brief description. Use that contextual information to come up with created and well-formed
description for the media assets. The description should be creative and engaging.

Important guidelines:

1. The description should be creative and engaging.
2. It should be concise, don't exceed 2-3 sentences.
3. The description should be relevant to the project.
4. The description should be well-formed and grammatically correct.
5. Last but not least, **always** return just the enhanced prompt, don't add
any extra content and/or explanation. **DO NOT ADD markdown** or quotes, return the
**PLAIN STRING**.
`;

export async function enhancePrompt(
  prompt: string,
  options: EnhancePromptOptions = { type: "video" },
) {
  const { type, project } = options;
  const projectInfo = !project
    ? ""
    : `
    ## Project Info

    Title: ${project.title}
    Description: ${project.description}
  `.trim();
  const promptInfo = !prompt.trim() ? "" : `User prompt: ${prompt}`;

  const { data } = await fal.subscribe("fal-ai/any-llm", {
    input: {
      system_prompt: SYSTEM_PROMPT,
      prompt: `
        Create a prompt for generating a ${type} via AI inference. Here's the context:
        ${projectInfo}
        ${promptInfo}
      `.trim(),
      model: "meta-llama/llama-3.2-1b-instruct",
    },
  });
  return data.output.replace(/^"|"$/g, "");
}
