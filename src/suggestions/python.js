export const registerPythonSuggestions = (monaco) => {
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: () => {
      console.log("triggered");
      return {
        suggestions: [
          {
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'for ${1:variable} in ${2:iterable}:\n\t${0:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if ${1:condition}:\n\t${0:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'class',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'class ${1:ClassName}:\n\tdef __init__(self, ${2:args}):\n\t\t${0:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'def',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'def ${1:func_name}(${2:args}):\n\t${0:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
        ]
      };
    }
  });
};
