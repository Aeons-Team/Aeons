export default function FolderPreview({ name, ...remaining }) {
  return <button {...remaining}>
    {name}
  </button>
}