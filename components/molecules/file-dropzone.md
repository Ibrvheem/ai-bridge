# FileDropzone Component

A reusable file upload component with drag and drop functionality built on top of `react-dropzone`.

## Features

- 🎯 **Drag and Drop**: Native drag and drop support
- 📁 **File Type Validation**: Configurable accepted file types
- 📏 **Size Validation**: Configurable maximum file size
- 🎨 **Customizable UI**: Flexible styling options
- 🔄 **File Preview**: Optional file preview with removal option
- ✅ **Custom Validation**: Add your own validation logic
- 🚨 **Error Handling**: Built-in error handling with toast notifications
- ♿ **Accessible**: Keyboard and screen reader friendly

## Basic Usage

```tsx
import { FileDropzone } from "@/components/molecules/file-dropzone";

function MyComponent() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <FileDropzone file={file} onFileSelect={setFile} label="Upload Document" />
  );
}
```

## Advanced Usage

### CSV/Excel Files Only

```tsx
<FileDropzone
  file={file}
  onFileSelect={setFile}
  label="Upload Spreadsheet"
  accept={{
    "text/csv": [".csv"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  }}
  maxSize={10 * 1024 * 1024} // 10MB
  helperText="CSV, XLS, XLSX up to 10MB"
  successMessage="Spreadsheet uploaded successfully!"
/>
```

### Image Files with Custom Validation

```tsx
<FileDropzone
  file={file}
  onFileSelect={setFile}
  label="Upload Avatar"
  accept={{
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
  }}
  maxSize={2 * 1024 * 1024} // 2MB
  onValidate={(file) => {
    if (file.type.startsWith("image/")) {
      return null; // Valid
    }
    return "Please upload an image file";
  }}
  placeholder="Upload your profile picture"
  helperText="PNG, JPG, GIF up to 2MB"
/>
```

### Multiple Files

```tsx
<FileDropzone
  file={files} // Array of files
  onFileSelect={setFiles}
  multiple={true}
  label="Upload Documents"
  placeholder="Upload multiple documents"
/>
```

### Disabled State

```tsx
<FileDropzone
  file={file}
  onFileSelect={setFile}
  disabled={isUploading}
  label="Upload Document"
  placeholder={isUploading ? "Uploading..." : "Select a file"}
/>
```

### Custom Styling

```tsx
<FileDropzone
  file={file}
  onFileSelect={setFile}
  className="my-custom-container"
  dropzoneClassName="border-dashed border-purple-300 hover:border-purple-400"
  label="Custom Styled Upload"
/>
```

### Without File Preview

```tsx
<FileDropzone
  file={file}
  onFileSelect={setFile}
  showPreview={false}
  label="Upload (No Preview)"
/>
```

## Props

| Prop                | Type                             | Default                            | Description                               |
| ------------------- | -------------------------------- | ---------------------------------- | ----------------------------------------- |
| `file`              | `File \| null`                   | -                                  | Currently selected file                   |
| `onFileSelect`      | `(file: File \| null) => void`   | -                                  | Callback when file is selected or removed |
| `label`             | `string`                         | -                                  | Optional label for the dropzone           |
| `placeholder`       | `string`                         | "Click to upload or drag and drop" | Placeholder text                          |
| `helperText`        | `string`                         | -                                  | Helper text shown below dropzone          |
| `accept`            | `DropzoneOptions["accept"]`      | CSV/Excel files                    | Accepted file types                       |
| `maxSize`           | `number`                         | 10MB                               | Maximum file size in bytes                |
| `multiple`          | `boolean`                        | `false`                            | Allow multiple files                      |
| `disabled`          | `boolean`                        | `false`                            | Disable the dropzone                      |
| `className`         | `string`                         | -                                  | Custom container className                |
| `dropzoneClassName` | `string`                         | -                                  | Custom dropzone area className            |
| `showPreview`       | `boolean`                        | `true`                             | Show file preview                         |
| `successMessage`    | `string`                         | -                                  | Custom success message                    |
| `errorMessage`      | `string`                         | -                                  | Custom error message                      |
| `onValidate`        | `(file: File) => string \| null` | -                                  | Custom validation function                |

## Use Cases

1. **Document Upload**: CSV, PDF, Word documents
2. **Image Upload**: Profile pictures, galleries
3. **Media Upload**: Videos, audio files
4. **Data Import**: CSV, JSON, XML files
5. **Bulk Upload**: Multiple file selection

## Integration with Forms

### React Hook Form

```tsx
import { Controller } from "react-hook-form";

<Controller
  name="document"
  control={control}
  render={({ field: { value, onChange } }) => (
    <FileDropzone
      file={value}
      onFileSelect={onChange}
      label="Upload Document"
    />
  )}
/>;
```

### With Validation

```tsx
const validateFile = (file: File) => {
  if (!file.name.includes("report")) {
    return "File name must contain 'report'";
  }
  return null;
};

<FileDropzone
  file={file}
  onFileSelect={setFile}
  onValidate={validateFile}
  label="Upload Report"
/>;
```

## Styling

The component uses Tailwind CSS classes and can be customized via:

- `className`: Container styling
- `dropzoneClassName`: Dropzone area styling
- CSS custom properties for deeper customization

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Focus management
