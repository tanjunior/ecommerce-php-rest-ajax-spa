# ecommerce-php-rest-ajax-spa
 
CREATE TABLE `users` (
  `userid` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
);


CREATE TABLE `items` (
  `ItemID` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Price` int(11) NOT NULL,
  `Category` varchar(255) NOT NULL,
  `ImageName` varchar(255) NOT NULL
);


CREATE TABLE `orders` (
  `orderid` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `price` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
);

INSERT INTO `items` (`Name`, `Description`, `Price`, `Category`, `ImageName`) VALUES
('Apple', 'A red apple.', 2, 'Fruits', 'Apple.jpeg'),
('Banana', 'A ripen banana.', 3, 'Fruits', 'Banana.jpeg'),
('Basil', 'Fresh basil', 4, 'Herbs', 'Basil.jpeg'),
('Broccoli', 'Fresh broccoli.', 2, 'vegetables',  'Broccoli.jpeg'),
('Carrot', 'Fresh carrots.', 1, 'Vegetables',  'Carrot.jpeg'),
('Chia Seeds', 'Chia seeds.', 1, 'Legumes', 'Chia Seeds.jpeg'),
('Dill', 'Fresh dill.', 5, 'Herbs', 'Dill.jpeg'),
('Dragon Fruit', 'A red dragon fruit.', 3, 'Fruits', 'Dragon Fruit.jpeg'),
('Button Mushrrom', 'Button mushrooms.', 1, 'Mushrooms', 'Button Mushrrom.jpeg'),
('Pineapple', 'Fresh pineapple.', 7, 'Fruits',  'Pineapple.jpeg'),
('Sweet corn', 'Sweet corn kernels.', 1, 'Legumes',  'Sweet corn.jpeg'),
('Kiwi', 'a kiwi fruit.', 3, 'Fruits', 'Kiwi.jpeg'),
('Lettuce', 'Fresh lettuce.', 2, 'Vegetables',  'Lettuce.jpeg'),
('Mango', 'Sweet mangoes.', 4, 'Fruits',  'Mango.jpeg'),
('Mung Bean', 'Mung beans.', 1, 'Legumes', 'Mung Bean.jpeg'),
('Oyster Mushroom', 'Oyster mushrooms.', 5, 'Mushrooms',  'Oyster Mushroom.jpeg'),
('Parsley', 'Fresh parsley.', 5, 'Herbs',  'Parsley.jpeg'),
('Peas', 'Green peas.', 2, 'Legumes', 'Peas.jpeg'),
('Portobello Mushroom', 'Portobello mushrooms.', 7, 'Mushrooms',  'Portobello Mushroom.jpeg'),
('Red Bean', 'Red beans.', 1, 'Legumes',  'Red Bean.jpeg'),
('Rosemary', 'Fresh rosemary.', 7, 'Herbs', 'Rosemary.jpeg'),
('Shitake Mushroom', 'Shitake mushrooms.', 5, 'Mushrooms', 'Shitake Mushroom.jpeg'),
('Watermelon', 'Big and refreshing!', 10, 'Fruits', 'Watermelon.jpeg');

INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('staff1', 'staff1@ceto.com', 'staff1', 'staff'),
('staff2', 'staff2@ceto.com', 'staff2', 'staff'),
('staff3', 'staff3@ceto.com', 'staff3', 'staff'),
('staff4', 'staff4@ceto.com', 'staff4', 'staff'),
('staff5', 'staff5@ceto.com', 'staff5', 'staff'),
('user1', 'user1@ceto.com', 'user1', 'member'),
('user2', 'user2@ceto.com', 'user2', 'member'),
('user3', 'user3@ceto.com', 'user3', 'member'),
('user4', 'user4@ceto.com', 'user4', 'member'),
('user5', 'user5@ceto.com', 'user5', 'member');
