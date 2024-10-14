export const registerSwiftSuggestions = (monaco) => {
  monaco.languages.registerCompletionItemProvider('swift', {
    provideCompletionItems: () => {
      return {
        suggestions: [
          {
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'for ${1:element} in ${2:collection} {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if ${1:condition} {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'while',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'while ${1:condition} {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'func',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'func ${1:functionName}(${2:parameters}) -> ${3:returnType} {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
        ]
      };
    }
  });
};
