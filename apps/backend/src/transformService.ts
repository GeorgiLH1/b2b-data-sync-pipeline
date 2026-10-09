import { z } from 'zod';
import { SourceProduct } from './sourceService.js';

// 1. Дефинираме Zod схема за стриктна валидация на входящите данни от Бизнес А
export const ProductSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(1, 'Заглавието е задължително'),
  price: z.number().nonnegative('Цената не може да бъде отрицателна'),
  description: z.string().optional().default('Няма предоставено описание'),
  category: z.string().optional().default('uncategorized'),
  image: z.string().url('Невалиден URL за изображение').optional(),
});

// Типизация, генерирана автоматично от Zod
export type ValidatedProduct = z.infer<typeof ProductSchema>;

// Интерфейс за трансформирания обект, подготвен за нашата PostgreSQL база
export interface TransformedProduct {
  externalId: string;
  title: string;
  category: string;
  price: number;
  description: string;
  rawPayload: any;
}

/**
 * Валидира и трансформира суровите данни от Бизнес А
 */
export function validateAndTransformProducts(rawData: SourceProduct[]): {
  validProducts: TransformedProduct[];
  invalidCount: number;
  errors: string[];
} {
  const validProducts: TransformedProduct[] = [];
  const errors: string[] = [];
  let invalidCount = 0;

  for (const item of rawData) {
    const parseResult = ProductSchema.safeParse(item);

    if (!parseResult.success) {
      invalidCount++;
      errors.push(`Продукт ID ${item.id || 'неизвестен'}: ${parseResult.error.message}`);
      continue; // Пропускаме невалидния продукт
    }

    const data = parseResult.data;

    // Базова трансформация и почистване на данните (Трансформация без AI)
    const transformed: TransformedProduct = {
      externalId: `BUSINESS_A_${data.id}`,
      title: data.title.trim(),
      category: data.category.toLowerCase().trim(),
      price: Math.round(data.price * 100) / 100, // Закръгляне до 2 знака след десетичната запетая
      description: data.description.trim(),
      rawPayload: item, // Запазваме оригиналния payload за архив
    };

    validProducts.push(transformed);
  }

  return { validProducts, invalidCount, errors };
}