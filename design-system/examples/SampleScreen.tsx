/**
 * 멍냥일기 디자인 시스템 샘플 화면
 *
 * 이 파일은 디자인 시스템 사용 예제입니다.
 * 실제 프로젝트에서 참고용으로 사용하세요.
 */

import React, { useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import {
  ThemeProvider,
  useTheme,
  Button,
  Card,
  PhotoCard,
  Input,
  Badge,
  Avatar,
  Modal,
  Container,
  PhotoGrid,
  Display,
  Heading,
  Body,
  Caption,
} from '../index';

export function SampleScreen() {
  return (
    <ThemeProvider>
      <SampleContent />
    </ThemeProvider>
  );
}

function SampleContent() {
  const { theme, mode, toggleMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background.primary,
      }}
    >
      <Container>
        <View style={{ paddingVertical: theme.spacing[6] }}>
          {/* Header */}
          <View style={{ marginBottom: theme.spacing[8] }}>
            <Display size="lg">멍냥일기</Display>
            <Body size="sm" color={theme.colors.neutral[600]}>
              디자인 시스템 샘플
            </Body>
          </View>

          {/* Theme Toggle */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <Heading level={3}>테마 설정</Heading>
            <Body size="sm" style={{ marginVertical: theme.spacing[2] }}>
              현재 모드: {mode}
            </Body>
            <Button onPress={toggleMode} variant="secondary" size="small">
              다크모드 토글
            </Button>
          </Card>

          {/* Buttons */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <Heading level={3} style={{ marginBottom: theme.spacing[3] }}>
              Buttons
            </Heading>
            <View style={{ gap: theme.spacing[2] }}>
              <Button onPress={() => {}} variant="primary" size="large">
                Primary Large
              </Button>
              <Button onPress={() => {}} variant="primary" size="medium">
                Primary Medium
              </Button>
              <Button onPress={() => {}} variant="secondary" size="medium">
                Secondary
              </Button>
              <Button onPress={() => {}} variant="text" size="medium">
                Text Button
              </Button>
              <Button onPress={() => {}} variant="primary" disabled>
                Disabled
              </Button>
              <Button onPress={() => {}} variant="primary" loading>
                Loading
              </Button>
            </View>
          </Card>

          {/* Badges */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <Heading level={3} style={{ marginBottom: theme.spacing[3] }}>
              Badges
            </Heading>
            <View style={{ flexDirection: 'row', gap: theme.spacing[2], flexWrap: 'wrap' }}>
              <Badge variant="default">기본</Badge>
              <Badge variant="dday">D+100</Badge>
              <Badge variant="new">NEW</Badge>
            </View>
          </Card>

          {/* Avatars */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <Heading level={3} style={{ marginBottom: theme.spacing[3] }}>
              Avatars
            </Heading>
            <View style={{ flexDirection: 'row', gap: theme.spacing[3], alignItems: 'center' }}>
              <Avatar
                source={{ uri: 'https://via.placeholder.com/80' }}
                size="sm"
                petType="none"
              />
              <Avatar
                source={{ uri: 'https://via.placeholder.com/80' }}
                size="md"
                petType="dog"
              />
              <Avatar
                source={{ uri: 'https://via.placeholder.com/80' }}
                size="lg"
                petType="cat"
              />
              <Avatar
                source={{ uri: 'https://via.placeholder.com/80' }}
                size="xl"
                petType="dog"
              />
            </View>
          </Card>

          {/* Input */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <Heading level={3} style={{ marginBottom: theme.spacing[3] }}>
              Input
            </Heading>
            <Input
              label="반려동물 이름"
              placeholder="이름을 입력하세요"
              value={inputValue}
              onChangeText={setInputValue}
              containerStyle={{ marginBottom: theme.spacing[3] }}
            />
            <Input
              label="에러 상태"
              placeholder="입력하세요"
              error="필수 입력 항목입니다"
            />
          </Card>

          {/* Typography */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <Heading level={3} style={{ marginBottom: theme.spacing[3] }}>
              Typography
            </Heading>
            <Display size="md">Display Medium</Display>
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2}>Heading 2</Heading>
            <Heading level={3}>Heading 3</Heading>
            <Body size="lg">Body Large</Body>
            <Body size="md">Body Medium (기본)</Body>
            <Body size="sm">Body Small</Body>
            <Caption size="md">Caption Medium</Caption>
            <Caption size="sm">Caption Small</Caption>
          </Card>

          {/* Photo Grid */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <Heading level={3} style={{ marginBottom: theme.spacing[3] }}>
              Photo Grid
            </Heading>
            <PhotoGrid columns={2} gap={8}>
              {[1, 2, 3, 4].map((i) => (
                <PhotoCard key={i}>
                  <Image
                    source={{ uri: `https://via.placeholder.com/300` }}
                    style={{ width: '100%', aspectRatio: 1 }}
                  />
                  <View style={{ padding: theme.spacing[2] }}>
                    <Body size="sm">사진 {i}</Body>
                    <Caption size="sm" color={theme.colors.neutral[600]}>
                      D+{i * 100}
                    </Caption>
                  </View>
                </PhotoCard>
              ))}
            </PhotoGrid>
          </Card>

          {/* Modal */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <Heading level={3} style={{ marginBottom: theme.spacing[3] }}>
              Modal
            </Heading>
            <Button onPress={() => setModalVisible(true)} variant="primary">
              모달 열기
            </Button>
          </Card>

          <Modal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            title="모달 제목"
            footer={
              <>
                <Button onPress={() => setModalVisible(false)} variant="secondary" size="small">
                  취소
                </Button>
                <Button onPress={() => setModalVisible(false)} variant="primary" size="small">
                  확인
                </Button>
              </>
            }
          >
            <Body>모달 내용입니다.</Body>
          </Modal>
        </View>
      </Container>
    </ScrollView>
  );
}
