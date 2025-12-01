interface FilesProps {
  files: File[];
};

function Files({ files }: FilesProps) {
  return (
    <div style={{ marginTop: "20px" }}>
      <ul>
        {files.map((file: File, index: number) => (
          <li key={index}>
            {file.name} ({file.type || "unknown type"}, {file.size} bytes)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Files;
