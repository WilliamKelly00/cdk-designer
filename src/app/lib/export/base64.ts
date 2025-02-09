export default function toBase64(data: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(data);

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };

    reader.onerror = (error) => reject(error);
  });
}
