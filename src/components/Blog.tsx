import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth, handleFirestoreError, OperationType } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'motion/react';
import { BookOpen, Plus, Lock, ChevronRight } from 'lucide-react';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  isPremium: boolean;
  createdAt: any;
}

export function BlogSection() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const { isSubscriber, isAdmin } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3));
        const snapshot = await getDocs(q);
        const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setPosts(postsData);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'posts');
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="space-y-6" id="blog-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#2E7D32]" />
          <h2 className="text-2xl font-serif font-bold">{t('blog.featured')}</h2>
        </div>
        <Button variant="ghost" className="text-stone-500 hover:text-stone-900">
          {t('common.seeAll')} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <BlogCard key={post.id} post={post} isLocked={post.isPremium && !isSubscriber && !isAdmin} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-stone-400 italic bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
            {t('blog.noPosts')}
          </div>
        )}
      </div>
    </section>
  );
}

function BlogCard({ post, isLocked }: any) {
  const { t } = useTranslation();
  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card className="h-full border-none shadow-lg bg-white overflow-hidden flex flex-col">
        <div className="h-40 bg-stone-200 relative">
          {isLocked && (
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            {post.isPremium && (
              <span className="bg-[#FBC02D] text-black text-[10px] font-bold px-2 py-1 rounded uppercase">{t('common.premium')}</span>
            )}
          </div>
        </div>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-serif leading-tight">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-sm text-stone-500 line-clamp-3">{post.excerpt || post.content.substring(0, 100) + '...'}</p>
        </CardContent>
        <div className="p-4 pt-0">
          <Button variant="link" className="p-0 h-auto text-[#2E7D32] font-bold text-sm">
            {t('common.readMore')}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export function AdminBlogEditor() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const { user } = useAuth();

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        excerpt: content.substring(0, 150),
        isPremium,
        authorId: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setTitle('');
      setContent('');
      setIsPremium(false);
      alert(t('common.published'));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    }
  };

  return (
    <Card className="border-none shadow-xl bg-white">
      <CardHeader>
        <CardTitle className="font-serif">{t('blog.writeNew')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePublish} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('blog.titleLabel')}</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('common.placeholder.title')} />
          </div>
          <div className="space-y-2">
            <Label>{t('blog.contentLabel')}</Label>
            <Textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder={t('common.placeholder.content')} 
              className="min-h-[200px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isPremium" 
              checked={isPremium} 
              onChange={e => setIsPremium(e.target.checked)}
              className="w-4 h-4 accent-[#2E7D32]"
            />
            <Label htmlFor="isPremium">{t('blog.premiumLabel')}</Label>
          </div>
          <Button type="submit" className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold">
            {t('blog.publishBtn')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
