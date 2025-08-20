// actions/saveFeedback.ts
'use server';
import Posts from '@/models/posts'; // You'll need to create this model


export async function saveFeedback(id:string,company: string, description: string,rating:number) {
  if (!id) {
    throw new Error('Unauthorized');
  }

  try {
    // Create a new feedback document
    const feedback = new Posts({
      postedBy: id,
      company,
  rating,
      description,
      createdAt: new Date(),
    });
console.log(feedback)
    await feedback.save();
    return { success: true };
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw new Error('Failed to save feedback');
  }
}