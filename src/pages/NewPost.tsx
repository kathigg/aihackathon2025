import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const NewPostPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(`https://fakecdn.com/uploads/${file.name}`), 1000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let fileUrl: string | null = null;

    if (file) {
      try {
        fileUrl = await uploadFile(file);
      } catch (err) {
        console.error('File upload failed:', err);
        return;
      }
    }

    const fakePost = {
      id: Date.now().toString(),
      title,
      body,
      fileUrl,
      created_at: new Date().toISOString(),
      is_pinned: false,
      comment_count: 0,
      net_score: 0,
      author: {
        username: 'john.doe',
        avatar_url: '',
      },
    };

    console.log('Mock post submitted:', fakePost);

    router.push('/');
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Top Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="text-xl font-semibold">Create a New Post</h2>
        <Button type="submit" form="new-post-form">
          Post
        </Button>
      </div>

      {/* Main Editor */}
      <form
        id="new-post-form"
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a concise and informative title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Body</label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            placeholder="You can use Markdown, LaTeX ($...$ or $$...$$), and fenced code blocks (```js)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Attach File</label>
          <input
            type="file"
            accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
            style={{ display: 'none' }}
            id="file-upload"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              setFile(selectedFile || null);
            }}
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center cursor-pointer text-blue-600 hover:underline"
          >
            📎 Choose a file
          </label>
          {file && (
            <div className="mt-2">
              <p className="text-sm">Selected: {file.name}</p>
              {file.type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="mt-2 max-h-48"
                />
              )}
            </div>
          )}
        </div>

        {body && (
          <div>
            <label className="block text-sm font-medium mb-1">Preview</label>
            <div className="prose max-w-none border rounded-md p-4 bg-white">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <SyntaxHighlighter
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  math({ value }) {
                    return <BlockMath math={value} />;
                  },
                  inlineMath({ value }) {
                    return <InlineMath math={value} />;
                  },
                }}
              >
                {body}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewPostPage;

