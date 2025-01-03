import {ChangeEvent, useCallback, useState} from "react";
import { Button } from "../button";
import FileUploader from "../file-uploader";
import { Input } from "../input";
import UploadImagePreview from "../upload-image-preview";
import { ChatHandler } from "./chat.interface";
import {
  createSplitFormDataList, mergeSplitFile,
  parallel,
  uploadSplitFile
} from "@/app/utils/file";

export default function ChatInput(
  props: Pick<
    ChatHandler,
    | "isLoading"
    | "input"
    | "onFileUpload"
    | "onFileError"
    | "handleSubmit"
    | "handleInputChange"
  > & {
    multiModal?: boolean;
  },
) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [referLink, setReferLink] = useState<string>('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (imageUrl) {
      props.handleSubmit(e, {
        data: { imageUrl: imageUrl },
      });
      setImageUrl(null);
      return;
    }
    props.handleSubmit(e, {
      data: {
        referLink
      }
    });

    setReferLink('')
  };

  const onRemovePreviewImage = () => setImageUrl(null);

  const handleUploadImageFile = async (file: File) => {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
    setImageUrl(base64);
  };

  const handleUploadFile = async (file: File) => {
    try {
      if (props.multiModal && file.type.startsWith("image/")) {
        return await handleUploadImageFile(file);
      }
      props.onFileUpload?.(file);
    } catch (error: any) {
      props.onFileError?.(error.message);
    }
  };

  const handleUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e?.target?.files?.[0]
      if (!file) return;
      const chunkList = createSplitFormDataList(file)
      parallel<FormData>(chunkList.map(({ formData }) => formData), uploadSplitFile, 5).finally(() => {
        mergeSplitFile(file.name)
      })
    } catch {}
  }, [])

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl bg-white p-4 shadow-xl space-y-4"
    >
      {imageUrl && (
        <UploadImagePreview url={imageUrl} onRemove={onRemovePreviewImage} />
      )}
      <div className="flex w-full items-center">
        <span className="inline-block mr-2">参考网站(可选)</span>
        <Input value={referLink} onChange={(e) => setReferLink(e.target.value)} name="referLink" className="flex-1" placeholder="Type your reference web link" />
      </div>
      <div className="flex w-full items-start justify-between gap-4 ">
        <Input
          autoFocus
          name="message"
          placeholder="Type a message"
          className="flex-1"
          value={props.input}
          onChange={props.handleInputChange}
        />
        <FileUploader
          config={{allowedExtensions: ['txt', 'pdf', 'jpeg'], disabled: false} }
          onFileUpload={handleUploadFile}
          onFileError={props.onFileError}
        />
        <label>
          <div className={'h-10 leading-10 hover:cursor-pointer'}>上传文件</div>
          <Input type={'file'} name={'upload'} className="hidden" onChange={handleUpload} />
        </label>
        <Button type="submit" disabled={props.isLoading}>
          Send message
        </Button>
      </div>
    </form>
  );
}
