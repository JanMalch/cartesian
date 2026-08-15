import { ExtraColumn } from './result-table/result-table';

export function formatAsMarkdown(
  extraColumns: ExtraColumn[],
  tableResult: Array<{ result: Record<string, string>; extras: Record<string, string | boolean> }>,
): string {
  return format(extraColumns, tableResult, {
    headerDelimiter: '|',
    bold: '**',
    italic: '_',
    checkmark: '✅',
    crossmark: '❌',
    afterHeaders: (columnCount) => '|' + (`---|`.repeat(columnCount)),
  })
}

export function formatAsAtlassian(
  extraColumns: ExtraColumn[],
  tableResult: Array<{ result: Record<string, string>; extras: Record<string, string | boolean> }>,
): string {
  return format(extraColumns, tableResult, {
    headerDelimiter: '||',
    bold: '*',
    italic: '_',
    checkmark: '(/)',
    crossmark: '(x)',
    afterHeaders: () => '',
  })
}

function format(
  extraColumns: ExtraColumn[],
  tableResult: Array<{ result: Record<string, string>; extras: Record<string, string | boolean> }>,
  options: {
    headerDelimiter: string,
    afterHeaders: (columnCount: number) => string,
    bold: string,
    italic: string,
    checkmark: string,
    crossmark: string,
  },
): string {
  if (tableResult.length === 0 || !tableResult[0].result) {
    return '';
  }
  let result = options.headerDelimiter;
  const resultKeys = Object.keys(tableResult[0].result);
  for (const col of resultKeys) {
    result += ` ${col} ${options.headerDelimiter}`;
  }
  for (const col of extraColumns) {
    result += ` ${col.name} ${options.headerDelimiter}`;
  }
  result += '\n';
  result += options.afterHeaders(resultKeys.length + extraColumns.length)

  for (const tresult of tableResult) {
    result += '\n|';
    for (const col of resultKeys) {
      result += ` ${tresult.result[col]} |`;
    }
    for (const col of extraColumns) {
      let text = '';
      switch (col.type) {
        case 'checkbox':
          text += tresult.extras[col.name] ? options.checkmark : options.crossmark;
          break;
        default:
          text += tresult.extras[col.name];
          break;
      }
      if (!text) {
        result += ' |';
        continue;
      }
      let content = '';
      for (const f of col.format) {
        switch (f) {
          case 'bold':
            content += '**';
            break;
          case 'italic':
            content += '_';
            break;
        }
      }
      content += text;
      for (const f of [...col.format].reverse()) {
        switch (f) {
          case 'bold':
            content += '**';
            break;
          case 'italic':
            content += '_';
            break;
        }
      }
      result += ` ${content} |`;
    }
  }

  return result;
}
