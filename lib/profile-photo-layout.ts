export interface ProfilePhotoLayoutSettings {
  photoPositionX: number;
  photoPositionY: number;
  photoZoom: number;
}

export function getProfilePhotoLayout(
  naturalWidth: number,
  naturalHeight: number,
  containerSize: number,
  settings: ProfilePhotoLayoutSettings
) {
  if (
    !naturalWidth ||
    !naturalHeight ||
    !containerSize
  ) {
    return null;
  }

  const x = Math.max(0, Math.min(100, settings.photoPositionX));
  const y = Math.max(0, Math.min(100, settings.photoPositionY));
  const zoom = Math.max(1, Math.min(3, settings.photoZoom));

  const baseScale = Math.max(
    containerSize / naturalWidth,
    containerSize / naturalHeight
  );

  const width = naturalWidth * baseScale * zoom;
  const height = naturalHeight * baseScale * zoom;

  return {
    width,
    height,
    left: (containerSize - width) * (x / 100),
    top: (containerSize - height) * (y / 100),
  };
}