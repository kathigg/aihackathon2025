import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const NewPostPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fakePost = {
      id: Date.now().toString(),
      title,
      body,
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

    // Redirect or simulate success
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Create a New Post</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                rows={8}
                placeholder="Describe your post in detail..."
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Post</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPostPage;