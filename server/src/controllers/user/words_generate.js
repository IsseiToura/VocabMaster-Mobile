const OpenAI = require("openai");
const Word = require("../../models/word");
const YourWord = require("../../models/yourWord");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const WordGenerationLimit = require("../../models/word_generation_limit");
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate 10 words at once
exports.generate = asyncHandler(async (req, res) => {
  const { ieltsLevel } = req.body;
  const userId = req.user.userId;
  const NUMBER_OF_WORDS = 10;
  const DAILY_LIMIT = 3;

  // check the user's usage limit
  let userLimit = await WordGenerationLimit.findOne({ userId });

  if (!userLimit) {
    userLimit = await WordGenerationLimit.create({ userId });
  }

  // check the date and reset if necessary
  userLimit.checkAndReset();

  // check if the limit is exceeded
  if (userLimit.count >= DAILY_LIMIT) {
    return res.status(429).json({
      status: "error",
      message:
        "You have reached your daily limit of word generations. Please try again tomorrow.",
    });
  }

  // Get user's learned words
  const yourWords = await YourWord.find({ userId }).populate("wordId");
  const wordsLearned = yourWords.map((uw) => uw.wordId.word);

  let promptWordsLearned = generatePromptWordsLearned(wordsLearned);
  console.log("promptWordsLearned", promptWordsLearned);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant who are good at English and Japanese.`,
      },
      {
        role: "user",
        content: `Generate ${NUMBER_OF_WORDS} words for IELTS ${ieltsLevel} level, and pronunciation, Japanese meaning, example sentence. 
        The words should be in the following format: english word, pronunciation, Japanese meaning, example sentence.
        Format the response as a JSON array of objects: [
          {
            word: "word",
            pronunciation: "pronunciation",
            meaning: "japanese meaning",
            example: "example sentence"
          }
        ]

        I have learned the following words, so please do not generate them: ${promptWordsLearned}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  // increment the usage count
  userLimit.count += 1;
  await userLimit.save();

  const result = JSON.parse(response.choices[0].message?.content.trim());
  if (!result.words || !Array.isArray(result.words)) {
    console.error("Invalid response format:", result);
    return res.status(400).json({ message: "Failed to generate words" });
  }

  // Save generated words to Word collection
  const savedWords = await Promise.all(
    result.words.map(async (wordData) => {
      const word = new Word({
        word: wordData.word,
        pronunciation: wordData.pronunciation,
        meaning: wordData.meaning,
        example: wordData.example,
        ieltsLevel: ieltsLevel,
      });
      await word.save();
      return word;
    })
  );

  res.status(201).json({
    message: "Words generated successfully",
    words: savedWords,
  });
});

// Save selected words to user's word list
exports.saveSelectedWords = asyncHandler(async (req, res) => {
  const { wordIds } = req.body;
  const userId = req.user.userId;

  if (!Array.isArray(wordIds) || wordIds.length === 0) {
    return res.status(400).json({ message: "No words selected" });
  }
  // Create user-word associations for selected words
  const yourWords = await Promise.all(
    wordIds.map(async (wordId) => {
      const yourWord = new YourWord({
        userId: userId,
        wordId: wordId,
      });
      await yourWord.save();
      return yourWord;
    })
  );

  res.status(201).json({
    message: "Words saved successfully",
    savedWords: yourWords,
  });
});

function generatePromptWordsLearned(wordsLearned) {
  let promptWordsLearned = "";
  wordsLearned.forEach((word) => (promptWordsLearned += `${word}, `));
  return promptWordsLearned;
}
