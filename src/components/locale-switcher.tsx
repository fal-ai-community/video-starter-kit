'use client'
import { Locale, locales } from '@/i18n/config';
import { setUserLocale } from '@/services/locale';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
// 引入 dropdown-menu.tsx 中的组件
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from './ui/dropdown-menu';

export default function LocaleSwitcher() {
    const [isPending, startTransition] = useTransition();
    const defaultValue = useLocale();
    const t = useTranslations('LocalSwitcher');

    function onChange(value: string) {
        const locale = value as Locale;
        startTransition(() => {
            setUserLocale(locale);
        });
    }

    return (
        <div className="relative">
            {/* 使用 DropdownMenu 替代 Select.Root */}
            <DropdownMenu>
                {/* 使用 DropdownMenuTrigger 替代 Select.Trigger */}
                <DropdownMenuTrigger>
                    {t(defaultValue)}
                </DropdownMenuTrigger>
                {/* 使用 DropdownMenuContent 替代 Select.Content */}
                <DropdownMenuContent>
                    {locales.map((item) => (
                        <DropdownMenuItem
                            key={item}
                            onClick={() => onChange(item)}
                        >
                            {t(item)}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}