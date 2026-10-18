import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { MasonryGallery } from '@/components/life/MasonryGallery'
import { getGallery } from '@/lib/content'
import { getBlurDataURL, getImageSize } from '@/lib/images'
import { pageMetadata } from '@/lib/seo'

const DESCRIPTION = 'Photos from races, trips and everyday life.'

export const metadata = pageMetadata({
  title: 'Gallery',
  description: DESCRIPTION,
  path: '/life/gallery',
})

export default async function GalleryPage() {
  const photos = await Promise.all(
    getGallery().map(async (image) => ({
      ...image,
      ...(await getImageSize(image.src)),
      blurDataURL: await getBlurDataURL(image.src),
    }))
  )

  return (
    <Container className="py-16 md:py-24">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Life', path: '/life' },
          { name: 'Gallery', path: '/life/gallery' },
        ]}
      />
      <PageHeader
        className="mt-10"
        path="/life/gallery"
        title="Gallery"
        description={DESCRIPTION}
      />

      <div className="mt-[clamp(40px,6vw,72px)]">
        {photos.length > 0 ? (
          <MasonryGallery photos={photos} />
        ) : (
          <p className="text-muted">Photos are on the way.</p>
        )}
      </div>
    </Container>
  )
}
