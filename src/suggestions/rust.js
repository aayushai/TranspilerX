export const registerRustSuggestions = (monaco) => {
  monaco.languages.registerCompletionItemProvider('rust', {
    provideCompletionItems: () => {
      return {
        suggestions: [
          {
            label: 'fn',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'fn ${1:function_name}(${2:args}) -> ${3:return_type} {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'for ${1:item} in ${2:collection} {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if ${1:condition} {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'struct',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'struct ${1:StructName} {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
        ]
      };
    }
  });
};
