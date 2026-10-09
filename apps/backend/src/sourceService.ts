import axios from 'axios';

// Типизация за данните, които идват от Бизнес А
export interface SourceProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const BUSINESS_A_API_URL = 'https://fakestoreapi.com/products?limit=10';

/**
 * Извлича суровите данни за продуктите от API-то на Бизнес А
 */
export async function fetchBusinessAData(): Promise<SourceProduct[]> {
  try {
    console.log('📡 [Бизнес А] Изпращане на заявка за извличане на данни...');
    
    const response = await axios.get<SourceProduct[]>(BUSINESS_A_API_URL, {
      timeout: 10000, // 10 секунди таймаут за защита от срив
    });

    console.log(`✅ [Бизнес А] Успешно извлечени ${response.data.length} продукта!`);
    return response.data;
  } catch (error: any) {
    console.error('❌ [Бизнес А] Грешка при извличане на данните:', error.message);
    throw new Error(`Външното API на Бизнес А не отговаря: ${error.message}`);
  }
}