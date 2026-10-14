import { PostListItem } from '@/components/blog/PostListItem'
import { Container } from '@/components/layout/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { getPosts } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

const DESCRIPTION = 'Notes on technology, entrepreneurship and fitness.'

export const metadata = pageMetadata({
  title: 'Writing',
  description: DESCRIPTION,
  path: '/writings',
})

export default function BlogIndexPage() {
  const posts = getPosts()

  return (
    <Container className="py-16 md:py-24">
      <Eyebrow path="/writings" />
      <h1 className="mt-4 h1">Writing</h1>
      <p className="mt-6 max-w-[60ch] text-muted">{DESCRIPTION}</p>

      <ul className="mt-16 max-w-[68ch]">
        {posts.map((post) => (
          <PostListItem key={post.slug} post={post} />
        ))}
      </ul>
    </Container>
  )
}
