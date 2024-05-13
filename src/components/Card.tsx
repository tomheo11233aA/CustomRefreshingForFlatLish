import React from 'react';
import { StyleSheet, Text, View, ViewProps, Image } from 'react-native';

const styles = StyleSheet.create({
  root: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1.33,
    borderRadius: 5,
  },
  cardInfo: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardLikes: {
    opacity: 0.35,
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export interface CardProps {
  index: number;
  loading: boolean;
  image: string;
  title: string;
  likes: string;
}

const Card: React.FC<CardProps & ViewProps> = ({
  style,
  image,
  title,
  likes,
  ...props
}) => {
  return (
    <View style={[styles.root, style]} {...props}>
      <Image source={{ uri: image }} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardLikes}>{likes} likes</Text>
      </View>
    </View>
  );
};

export default Card;
