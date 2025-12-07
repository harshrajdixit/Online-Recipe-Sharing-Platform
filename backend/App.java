public class App {
    public static void main(String[] args) {
        // Placeholder: demo data
        Recipe r1 = new Recipe(1,"Masala Tea","Tea leaves, Milk, Sugar","Boil water, add tea, milk and sugar","admin");
        DB.recipes.add(r1);
        System.out.println("Recipes in DB:");
        for(Recipe r : DB.recipes){
            System.out.println(r.id + " - " + r.title + " by " + r.author);
        }
    }
}
