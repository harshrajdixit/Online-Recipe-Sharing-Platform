public class Recipe {
    public int id;
    public String title;
    public String ingredients;
    public String instructions;
    public String author;

    public Recipe(int id, String title, String ingredients, String instructions, String author){
        this.id = id;
        this.title = title;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.author = author;
    }
}
