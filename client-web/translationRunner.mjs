import pkg from "react-intl-translations-manager"

const manageTranslations = pkg.default;
const {readMessageFiles, createSingleMessagesFile} = pkg;

const messagesDir = "tmp/messages"
const translationsDir = "src/translations/"
const singleMessageFileDir = "."

manageTranslations({
    messagesDirectory: messagesDir,
    translationsDirectory: translationsDir,
    languages: ["en", "ru"],
})

const extractedMessages = readMessageFiles(messagesDir)

createSingleMessagesFile({
    messages: extractedMessages,
    directory: singleMessageFileDir,
    jsonSpaceIndentation: 4,
})
