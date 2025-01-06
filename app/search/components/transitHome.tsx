import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function TransitHome() {
    return (
        <Button asChild className="mb-4">
        <Link href={'/'}>トップ画面へ</Link>
        </Button>
    )
}