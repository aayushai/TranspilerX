export const registerCppSuggestions = (monaco) => {
  monaco.languages.registerCompletionItemProvider('cpp', {
    provideCompletionItems: () => {
      return {
        suggestions: [
          {
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if (${1:condition}) {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'while',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'while (${1:condition}) {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'class',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'class ${1:ClassName} {\npublic:\n\t${1:ClassName}(${2:args}) {\n\t\t${0}\n\t}\n};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
        ]
      };
    }
  });
};
