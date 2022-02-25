export function jsonLoader(source) {
  // console.log('json-loader!', source);

  return `export default ${JSON.stringify(source)}`;
}
