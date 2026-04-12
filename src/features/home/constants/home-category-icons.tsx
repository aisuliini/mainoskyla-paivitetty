import type { ReactNode } from 'react'
import {
  Hammer,
  PawPrint,
  Scissors,
  Camera,
  PartyPopper,
  Heart,
  Home as HomeIcon,
  Calendar,
  Briefcase,
  Store,
} from 'lucide-react'

export const homeCategoryIcons: Record<string, ReactNode> = {
  'arjen-palvelut': <Hammer className="h-6 w-6 text-[#1E3A41]" />,
  'erikoisliikkeet-ja-myymalat': <Store className="h-6 w-6 text-[#1E3A41]" />,
  'koti-ja-remontointi': <HomeIcon className="h-6 w-6 text-[#1E3A41]" />,
  'hyvinvointi-ja-kauneus': <Heart className="h-6 w-6 text-[#1E3A41]" />,
  'elainpalvelut': <PawPrint className="h-6 w-6 text-[#1E3A41]" />,
  'luovat-palvelut-ja-esiintyjat': <Camera className="h-6 w-6 text-[#1E3A41]" />,
  'kasityolaiset-ja-pientuottajat': <Scissors className="h-6 w-6 text-[#1E3A41]" />,
  'tapahtumat-ja-juhlapalvelut': <PartyPopper className="h-6 w-6 text-[#1E3A41]" />,
  'tilat-ja-vuokraus': <Calendar className="h-6 w-6 text-[#1E3A41]" />,
  'valmennus-ja-asiantuntijapalvelut': <Briefcase className="h-6 w-6 text-[#1E3A41]" />,
}