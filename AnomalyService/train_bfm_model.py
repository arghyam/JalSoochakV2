# line 8 and 9 i will remove in prod environment

# Note to anybody reading this model has 100% accuracy at this point after 10 epochs 
# which might indicate overfitting, further tuning and data augmentation might be necessary for a robust model.
# I WILL NEED MORE BFM AND NON BFM IMAGES FROM ARGRAM TO IMPROVE THE MODEL

# This line is to bypass SSL certificate verification for downloading datasets or models.
import ssl
ssl._create_default_https_context = ssl._create_unverified_context 
#THIS LINE ABOVE SHOULD BE REMOVED IN PRODUCTION ENVIRONMENT

import tensorflow as tf

MobileNetV2 = tf.keras.applications.MobileNetV2
Dense = tf.keras.layers.Dense
GlobalAveragePooling2D = tf.keras.layers.GlobalAveragePooling2D
Model = tf.keras.models.Model


IMG_SIZE = (224, 224)
BATCH_SIZE = 32

train_ds = tf.keras.utils.image_dataset_from_directory(
    "dataset/train",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="binary"
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    "dataset/val",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="binary"
)


normalization_layer = tf.keras.layers.Rescaling(1./255)

train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y))

base_model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation="relu")(x)
output = Dense(1, activation="sigmoid")(x)

model = Model(inputs=base_model.input, outputs=output)

model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=10
)

model.save("bfm_classifier.h5")
