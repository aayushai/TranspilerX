export const registerCSharpSuggestions = (monaco) => {
  monaco.languages.registerCompletionItemProvider('csharp', {
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
            label: 'foreach',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'foreach (var ${1:item} in ${2:collection}) {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'class',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'class ${1:ClassName} {\n\t${1:ClassName}(${2:args}) {\n\t\t${0}\n\t}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
        ]
      };
    }
  });
};
